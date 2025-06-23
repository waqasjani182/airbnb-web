import React from 'react';
import { Link } from 'react-router-dom';
import { Booking, BookingStatus } from '../../types';
import { Card, Badge, Button } from '../ui';
import { formatCurrency, formatDate } from '../../utils/helpers';

interface BookingCardProps {
  booking: Booking;
  onUpdateStatus?: (bookingId: number, status: BookingStatus) => void;
  showHostActions?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onUpdateStatus,
  showHostActions = false,
}) => {
  const getStatusVariant = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return 'success';
      case BookingStatus.PENDING:
        return 'warning';
      case BookingStatus.CANCELLED:
        return 'error';
      case BookingStatus.COMPLETED:
        return 'info';
      default:
        return 'default';
    }
  };

  const isUpcoming = new Date(booking.check_in_date) > new Date();
  const isActive = new Date(booking.check_in_date) <= new Date() && new Date(booking.check_out_date) >= new Date();
  const isPast = new Date(booking.check_out_date) < new Date();

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {booking.property.title}
            </h3>
            <Badge variant={getStatusVariant(booking.status)}>
              {booking.status}
            </Badge>
          </div>
          <p className="text-gray-600 text-sm mb-2">
            📍 {booking.property.city}
          </p>
          <div className="text-sm text-gray-600 space-y-1">
            <div>📅 {formatDate(booking.check_in_date)} - {formatDate(booking.check_out_date)}</div>
            <div>👥 {booking.guest_count} guest{booking.guest_count > 1 ? 's' : ''}</div>
            {showHostActions && (
              <div>🏠 Guest: {booking.guest.first_name} {booking.guest.last_name}</div>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(booking.total_amount)}
          </div>
          <div className="text-sm text-gray-500">total</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Link to={`/property/${booking.property.property_id}`}>
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
          {isUpcoming && booking.status === BookingStatus.CONFIRMED && (
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

        {showHostActions && onUpdateStatus && booking.status === BookingStatus.PENDING && (
          <div className="flex space-x-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onUpdateStatus(booking.booking_id, BookingStatus.CONFIRMED)}
            >
              Accept
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateStatus(booking.booking_id, BookingStatus.CANCELLED)}
            >
              Decline
            </Button>
          </div>
        )}

        {showHostActions && onUpdateStatus && booking.status === BookingStatus.CONFIRMED && (
          <div className="flex space-x-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onUpdateStatus(booking.booking_id, BookingStatus.COMPLETED)}
            >
              Mark Complete
            </Button>
            {isUpcoming && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateStatus(booking.booking_id, BookingStatus.CANCELLED)}
              >
                Cancel
              </Button>
            )}
          </div>
        )}

        {!showHostActions && booking.status === BookingStatus.PENDING && isUpcoming && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateStatus?.(booking.booking_id, BookingStatus.CANCELLED)}
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

export default BookingCard;
