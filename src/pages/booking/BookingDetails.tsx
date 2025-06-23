import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Layout } from '../../components/layout';
import { Loading, Button, Card, Badge } from '../../components/ui';
import PropertyImagesGallery from '../../components/booking/PropertyImagesGallery';
import { useGetBookingByIdQuery, useUpdateBookingStatusMutation } from '../../services/bookingApi';
import { BookingStatus } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { useErrorHandler } from '../../hooks';
import toast from 'react-hot-toast';

const BookingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: bookingResponse, isLoading, error } = useGetBookingByIdQuery(Number(id));
  const [updateBookingStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();

  const booking = bookingResponse?.booking;

  const handleStatusUpdate = async (newStatus: string) => {
    if (!booking) return;

    try {
      await updateBookingStatus({
        id: booking.booking_id,
        data: { status: newStatus }
      }).unwrap();

      toast.success(`Booking ${newStatus.toLowerCase()} successfully`);
    } catch (error: any) {
      handleError(error, 'Failed to update booking status');
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Cancelled':
        return 'error';
      case 'Completed':
        return 'info';
      default:
        return 'default';
    }
  };

  // Determine user role based on user_ID and host_id
  const isHost = user?.id === booking?.host_id;
  const isGuest = user?.id === booking?.user_ID;
  const canConfirm = isHost && booking?.status === 'Pending';
  const canCancel = (isHost || isGuest) && ['Pending', 'Confirmed'].includes(booking?.status || '');
  const canComplete = isHost && booking?.status === 'Confirmed';

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading size="lg" text="Loading booking details..." />
        </div>
      </Layout>
    );
  }

  if (error || !booking) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h2>
            <p className="text-gray-600 mb-6">The booking you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button onClick={() => navigate('/bookings')}>
              Back to Bookings
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const checkInDate = new Date(booking?.start_date || '');
  const checkOutDate = new Date(booking?.end_date || '');
  const isUpcoming = checkInDate > new Date();
  const isActive = checkInDate <= new Date() && checkOutDate >= new Date();
  const isPast = checkOutDate < new Date();

  // Calculate number of days
  const numberOfDays = booking ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => navigate('/bookings')}
              className="flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Bookings</span>
            </Button>

            <Badge variant={getStatusVariant(booking.status)}>
              {booking.status}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isHost ? 'Host View' : 'Guest View'} - Booking #{booking.booking_id}
              </h1>
              <p className="text-gray-600 mt-2">
                {isHost ? `Guest: ${booking.guest_name}` : booking.title}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Booking Date</p>
              <p className="text-lg font-semibold">{formatDate(booking.booking_date)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Images Gallery */}
            <PropertyImagesGallery
              images={booking.property_images || []}
              title={booking.title}
            />

            {/* Property Information */}
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{booking.title}</h4>
                  <p className="text-gray-600">{booking.property_type}</p>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{booking.address}, {booking.city}</span>
                </div>
                {booking.description && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Description</h5>
                    <p className="text-gray-600">{booking.description}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Booking Details */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-900 font-medium">{formatDate(booking.start_date)}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-900 font-medium">{formatDate(booking.end_date)}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      <p className="text-gray-900 font-medium">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-900 font-medium">{numberOfDays} night{numberOfDays > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isHost ? 'Guest Information' : 'Host Information'}
              </h3>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {isHost
                      ? booking.guest_name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2)
                      : booking.host_name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2)
                    }
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-xl font-semibold text-gray-900 mb-1">
                    {isHost ? booking.guest_name : booking.host_name}
                  </p>
                  <p className="text-gray-600 mb-2">
                    {isHost ? 'Guest' : 'Property Host'}
                  </p>
                  {isHost && (
                    <div className="text-sm text-gray-500">
                      <p>Booking for {booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
                    </div>
                  )}
                  {!isHost && (
                    <div className="text-sm text-gray-500">
                      <p>Property owner and host</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Summary */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{formatCurrency(booking.rent_per_day)} × {numberOfDays} night{numberOfDays > 1 ? 's' : ''}</span>
                  <span className="text-gray-900">{formatCurrency(booking.rent_per_day * numberOfDays)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-blue-600">{formatCurrency(booking.total_amount)}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Actions */}
            {(canConfirm || canCancel || canComplete) && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {isHost ? 'Host Actions' : 'Guest Actions'}
                </h3>
                <div className="space-y-3">
                  {canConfirm && (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusUpdate('Confirmed')}
                      isLoading={isUpdating}
                    >
                      ✓ Confirm Booking
                    </Button>
                  )}

                  {canComplete && (
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleStatusUpdate('Completed')}
                      isLoading={isUpdating}
                    >
                      ✓ Mark as Completed
                    </Button>
                  )}

                  {canCancel && (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => handleStatusUpdate('Cancelled')}
                      isLoading={isUpdating}
                    >
                      ✕ Cancel Booking
                    </Button>
                  )}
                </div>

                {isHost && booking.status === 'Pending' && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Action Required:</strong> Please review and confirm this booking request.
                    </p>
                  </div>
                )}

                {isHost && booking.status === 'Confirmed' && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Ready to Complete:</strong> Mark as completed after the guest checks out.
                    </p>
                  </div>
                )}
              </Card>
            )}

            {/* Status Information */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <Badge variant={getStatusVariant(booking.status)} className="text-lg px-4 py-2">
                    {booking.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {isUpcoming && booking.status === 'Confirmed' && (
                    <div className="flex items-center text-sm text-blue-600 bg-blue-50 p-2 rounded">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Upcoming trip
                    </div>
                  )}

                  {isActive && booking.status === 'Confirmed' && (
                    <div className="flex items-center text-sm text-green-600 bg-green-50 p-2 rounded">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Currently staying
                    </div>
                  )}

                  {isPast && booking.status === 'Completed' && (
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Trip completed
                    </div>
                  )}

                  {booking.status === 'Pending' && (
                    <div className="flex items-center text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Awaiting confirmation
                    </div>
                  )}

                  {booking.status === 'Cancelled' && (
                    <div className="flex items-center text-sm text-red-600 bg-red-50 p-2 rounded">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Booking cancelled
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingDetails;
