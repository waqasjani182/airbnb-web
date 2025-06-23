import React from 'react';
import { Link } from 'react-router-dom';
import { BookingListItem } from '../../types/booking.types';
import { Card, Badge, Button } from '../ui';
import { formatCurrency, formatDate } from '../../utils/helpers';

interface BookingListCardProps {
  booking: BookingListItem;
  onUpdateStatus?: (bookingId: number, status: string) => void;
  showHostActions?: boolean;
}

const BookingListCard: React.FC<BookingListCardProps> = ({
  booking,
  onUpdateStatus,
  showHostActions = false,
}) => {
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

  return (
    <Card>
      <div className="flex items-start space-x-4 mb-4">
        {/* Property Image */}
        <div className="flex-shrink-0">
          <img
            src={booking.property_image}
            alt={booking.title}
            className="w-20 h-20 object-cover rounded-lg"
          />
        </div>

        {/* Booking Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {booking.title}
                </h3>
                <Badge variant={getStatusVariant(booking.status)}>
                  {booking.status}
                </Badge>
              </div>
              
              <p className="text-gray-600 text-sm mb-2">
                📍 {booking.city}
              </p>
              
              <div className="text-sm text-gray-600 space-y-1">
                <div>📅 {formatDate(booking.start_date)} - {formatDate(booking.end_date)}</div>
                <div>👥 {booking.guests} guest{booking.guests > 1 ? 's' : ''}</div>
                {showHostActions && (
                  <div>🏠 Guest ID: {booking.user_ID}</div>
                )}
                {!showHostActions && booking.host_name && (
                  <div>🏠 Host: {booking.host_name}</div>
                )}
                {showHostActions && booking.guest_name && (
                  <div>👤 Guest: {booking.guest_name}</div>
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

          {/* Quick status indicators */}
          {isUpcoming && booking.status === 'Confirmed' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Upcoming
            </span>
          )}
          {isActive && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          )}
        </div>

        {showHostActions && onUpdateStatus && booking.status === 'Pending' && (
          <div className="flex space-x-2">
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
          </div>
        )}

        {showHostActions && onUpdateStatus && booking.status === 'Confirmed' && (
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

        {!showHostActions && booking.status === 'Pending' && isUpcoming && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateStatus?.(booking.booking_id, 'Cancelled')}
          >
            Cancel Booking
          </Button>
        )}
      </div>

      {isActive && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span className="text-green-800 text-sm font-medium">
              Currently staying
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default BookingListCard;
