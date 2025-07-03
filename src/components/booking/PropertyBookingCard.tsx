import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookingListItem } from '../../types/booking.types';
import { Card, Badge, Button } from '../ui';
import { HostReviewModal } from '../reviews';
import { formatCurrency, formatDate } from '../../utils/helpers';

interface PropertyBookingCardProps {
  booking: BookingListItem;
  onUpdateStatus?: (bookingId: number, status: string) => void;
  onViewGuest?: (guestId: number) => void;
  showHostReviewActions?: boolean;
  hasHostReview?: boolean;
}

const PropertyBookingCard: React.FC<PropertyBookingCardProps> = ({
  booking,
  onUpdateStatus,
  onViewGuest,
  showHostReviewActions = false,
  hasHostReview = false,
}) => {
  const [showHostReviewModal, setShowHostReviewModal] = useState(false);
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

  const isUpcoming = new Date(booking.start_date) > new Date();
  const isActive = new Date(booking.start_date) <= new Date() && new Date(booking.end_date) >= new Date();
  const isPast = new Date(booking.end_date) < new Date();

  const getTimeStatus = () => {
    if (isActive) return { label: 'Currently staying', color: 'green' };
    if (isUpcoming) return { label: 'Upcoming', color: 'blue' };
    if (isPast) return { label: 'Past', color: 'gray' };
    return null;
  };

  const timeStatus = getTimeStatus();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4 mb-4">
        {/* Property Image */}
        <div className="flex-shrink-0">
          <img
            src={booking.property_image}
            alt={booking.title}
            className="w-24 h-24 object-cover rounded-lg"
          />
        </div>

        {/* Booking Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {booking.title}
                </h3>
                <Badge variant={getStatusVariant(booking.status)}>
                  {booking.status}
                </Badge>
                {timeStatus && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${timeStatus.color}-100 text-${timeStatus.color}-800`}>
                    {timeStatus.label}
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 text-sm mb-2">
                📍 {booking.city}
              </p>
              
              <div className="text-sm text-gray-600 space-y-1">
                <div>📅 {formatDate(booking.start_date)} - {formatDate(booking.end_date)}</div>
                <div>👥 {booking.guests} guest{booking.guests > 1 ? 's' : ''}</div>
                <div>🏠 Booking ID: #{booking.booking_id}</div>
                {booking.guest_name && (
                  <div className="flex items-center space-x-2">
                    <span>👤 Guest: {booking.guest_name}</span>
                    {onViewGuest && (
                      <button
                        onClick={() => onViewGuest(booking.user_ID)}
                        className="text-blue-600 hover:text-blue-800 text-xs underline"
                      >
                        View Profile
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-xl font-bold text-gray-900">
                {formatCurrency(booking.total_amount)}
              </div>
              <div className="text-sm text-gray-500">total</div>
              <div className="text-xs text-gray-400">
                {formatCurrency(booking.rent_per_day)}/night
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Link to={`/property/${booking.property_id}`}>
            <Button variant="outline" size="sm">
              View Property
            </Button>
          </Link>
          <Link to={`/bookings/${booking.booking_id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
          
          {/* Host Review Actions for Completed Bookings */}
          {showHostReviewActions && booking.status === 'Completed' && (
            <>
              {!hasHostReview ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowHostReviewModal(true)}
                >
                  Review Guest
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHostReviewModal(true)}
                >
                  Edit Guest Review
                </Button>
              )}
            </>
          )}

          {/* Revenue indicator */}
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            💰 Revenue: {formatCurrency(booking.total_amount)}
          </span>
        </div>

        {/* Status Management Actions */}
        {onUpdateStatus && (
          <div className="flex space-x-2">
            {booking.status === 'Pending' && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onUpdateStatus(booking.booking_id, 'Confirmed')}
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateStatus(booking.booking_id, 'Cancelled')}
                >
                  Decline
                </Button>
              </>
            )}
            
            {booking.status === 'Confirmed' && (
              <div className="flex space-x-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onUpdateStatus(booking.booking_id, 'Completed')}
                >
                  Mark Complete
                </Button>
                {isUpcoming && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateStatus(booking.booking_id, 'Cancelled')}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Special Status Indicators */}
      {isActive && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-green-800 text-sm font-medium">
              Guest is currently staying at your property
            </span>
          </div>
        </div>
      )}

      {booking.status === 'Pending' && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
              <span className="text-yellow-800 text-sm font-medium">
                Awaiting your response
              </span>
            </div>
            <span className="text-yellow-600 text-xs">
              Booked on {formatDate(booking.booking_date)}
            </span>
          </div>
        </div>
      )}

      {/* Host Review Modal */}
      {showHostReviewModal && (
        <HostReviewModal
          isOpen={showHostReviewModal}
          onClose={() => setShowHostReviewModal(false)}
          bookingId={booking.booking_id}
          guestName={booking.guest_name || 'Guest'}
          propertyTitle={booking.title}
        />
      )}
    </Card>
  );
};

export default PropertyBookingCard;
