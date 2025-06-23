import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '../../components/layout';
import { Button, Card } from '../../components/ui';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';
import { CreateBookingData } from '../../types/booking.types';

const BookingConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking as CreateBookingData;

  if (!booking) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h2>
            <p className="text-gray-600 mb-6">We couldn't find your booking confirmation.</p>
            <Button onClick={() => navigate(ROUTES.BOOKINGS)}>
              View My Bookings
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600">
            Your booking request has been submitted successfully.
          </p>
        </div>

        {/* Booking Summary */}
        <Card className="mb-6">
          <div className="flex items-start space-x-4 mb-6">
            <img
              src={booking.property_image}
              alt={booking.title}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {booking.title}
              </h3>
              <p className="text-gray-600">📍 {booking.city}</p>
              <p className="text-gray-500 text-sm">{booking.address}</p>
              <p className="text-gray-500 text-sm">{booking.property_type}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                <p className="text-gray-900">{formatDate(booking.start_date)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                <p className="text-gray-900">{formatDate(booking.end_date)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                <p className="text-gray-900">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Booking ID</label>
                <p className="text-gray-900">#{booking.booking_id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <p className="text-gray-900">{booking.number_of_days} night{booking.number_of_days > 1 ? 's' : ''}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <p className="text-gray-900">{booking.status}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2 mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">
                    {formatCurrency(booking.rent_per_day)} × {booking.number_of_days} night{booking.number_of_days > 1 ? 's' : ''}
                  </span>
                  <span>{formatCurrency(booking.total_amount)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-2">
                <span>Total Amount</span>
                <span className="text-green-600">{formatCurrency(booking.total_amount)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Status Information */}
        <Card className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h4>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-yellow-600 text-sm font-bold">1</span>
              </div>
              <div>
                <h5 className="font-medium text-gray-900">Waiting for Host Approval</h5>
                <p className="text-gray-600 text-sm">
                  Your booking is currently pending. The host will review and respond to your request.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-gray-600 text-sm font-bold">2</span>
              </div>
              <div>
                <h5 className="font-medium text-gray-900">Confirmation</h5>
                <p className="text-gray-600 text-sm">
                  Once approved, you'll receive a confirmation email with check-in details.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-gray-600 text-sm font-bold">3</span>
              </div>
              <div>
                <h5 className="font-medium text-gray-900">Enjoy Your Stay</h5>
                <p className="text-gray-600 text-sm">
                  Check in on your scheduled date and enjoy your trip!
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            className="flex-1"
            onClick={() => navigate(`/bookings/${booking.booking_id}`)}
          >
            View Booking Details
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate(ROUTES.BOOKINGS)}
          >
            View All Bookings
          </Button>
        </div>

        {/* Additional Information */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h5 className="font-medium text-blue-900 mb-1">Important Information</h5>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• You will receive email notifications about your booking status</li>
                <li>• You can cancel your booking before it's confirmed</li>
                <li>• Contact the host directly if you have any questions</li>
                <li>• Check-in instructions will be provided upon confirmation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm mb-4">
            Share your booking confirmation
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Booking Confirmation',
                    text: `I just booked ${booking.title} for ${formatDate(booking.start_date)} - ${formatDate(booking.end_date)}`,
                    url: window.location.href,
                  });
                } else {
                  // Fallback for browsers that don't support Web Share API
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
            >
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
            >
              Print
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingConfirmation;
