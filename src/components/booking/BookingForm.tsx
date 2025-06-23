import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Button, Input, Card, Loading } from '../ui';
import { formatCurrency } from '../../utils/helpers';
import {
  useCreateBookingMutation,
  useLazyCheckPropertyAvailabilityQuery
} from '../../services/bookingApi';
import { useErrorHandler } from '../../hooks';
import { ROUTES } from '../../utils/constants';
import { Property } from '../../types/property.types';

const createBookingSchema = (maxGuests: number) => z.object({
  check_in_date: z.string().min(1, 'Check-in date is required'),
  check_out_date: z.string().min(1, 'Check-out date is required'),
  guest_count: z.number()
    .min(1, 'At least 1 guest is required')
    .max(maxGuests, `Maximum ${maxGuests} guests allowed`),
}).refine((data) => {
  const checkIn = new Date(data.check_in_date);
  const checkOut = new Date(data.check_out_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return checkIn >= today;
}, {
  message: "Check-in date cannot be in the past",
  path: ["check_in_date"],
}).refine((data) => {
  const checkIn = new Date(data.check_in_date);
  const checkOut = new Date(data.check_out_date);

  return checkOut > checkIn;
}, {
  message: "Check-out date must be after check-in date",
  path: ["check_out_date"],
});

type BookingFormData = z.infer<ReturnType<typeof createBookingSchema>>;

interface BookingFormProps {
  property: Property;
}

const BookingForm: React.FC<BookingFormProps> = ({ property }) => {
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const [createBooking, { isLoading }] = useCreateBookingMutation();
  const [checkAvailability, { isLoading: isCheckingAvailability }] = useLazyCheckPropertyAvailabilityQuery();

  const [nights, setNights] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [priceBreakdown, setPriceBreakdown] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [availabilityData, setAvailabilityData] = useState<any>(null);
  const [maxGuests, setMaxGuests] = useState<number>(property.guest || 10);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(createBookingSchema(maxGuests)),
    defaultValues: {
      guest_count: 1,
    },
  });

  const checkInDate = watch('check_in_date');
  const checkOutDate = watch('check_out_date');
  const guestCount = watch('guest_count');

  // Calculate nights when dates change
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      if (checkOut > checkIn) {
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nightsCount = Math.ceil(timeDiff / (1000 * 3600 * 24));
        setNights(nightsCount);
      } else {
        setNights(0);
      }
    } else {
      setNights(0);
    }
  }, [checkInDate, checkOutDate]);

  // Check availability when dates or guest count change
  useEffect(() => {
    const checkAvailabilityAndPrice = async () => {
      if (checkInDate && checkOutDate && guestCount && nights > 0) {
        try {
          // Reset states
          setIsAvailable(null);
          setAvailabilityChecked(false);
          setPriceBreakdown(null);
          setTotalAmount(0);

          // Check availability - this now includes pricing information
          const availabilityResult = await checkAvailability({
            propertyId: property.property_id,
            startDate: checkInDate,
            endDate: checkOutDate,
            guests: guestCount,
          }).unwrap();

          setIsAvailable(availabilityResult.available);
          setAvailabilityChecked(true);

          if (availabilityResult.available) {
            // Store availability data for additional information
            setAvailabilityData(availabilityResult);

            // Update max guests from API response
            setMaxGuests(availabilityResult.max_guests);

            // Use pricing from availability response
            setTotalAmount(availabilityResult.total_amount);

            // Create a simple price breakdown from availability data
            const simplePriceBreakdown = {
              base_price_per_night: availabilityResult.price_per_day,
              total_nights: availabilityResult.number_of_days,
              subtotal: availabilityResult.total_amount,
              cleaning_fee: 0,
              service_fee: 0,
              taxes: 0,
              total: availabilityResult.total_amount,
            };
            setPriceBreakdown(simplePriceBreakdown);
          } else {
            // Store availability data even when not available for conflict info
            setAvailabilityData(availabilityResult);
          }
        } catch (error: any) {
          console.error('Error checking availability:', error);
          setIsAvailable(false);
          setAvailabilityChecked(true);
          // Fallback to simple calculation
          setTotalAmount(nights * property.rent_per_day);
        }
      } else {
        setIsAvailable(null);
        setAvailabilityChecked(false);
        setPriceBreakdown(null);
        setTotalAmount(0);
      }
    };

    const timeoutId = setTimeout(checkAvailabilityAndPrice, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [checkInDate, checkOutDate, guestCount, nights, property.property_id, property.rent_per_day, checkAvailability]);

  const handleFormSubmit = async (data: BookingFormData) => {
    try {
      if (totalAmount <= 0) {
        toast.error('Please select valid dates');
        return;
      }

      if (!availabilityChecked) {
        toast.error('Please wait while we check availability');
        return;
      }

      if (isAvailable === false) {
        toast.error('Property is not available for selected dates');
        return;
      }

      const bookingData = {
        property_id: property.property_id,
        start_date: data.check_in_date,
        end_date: data.check_out_date,
        guests: data.guest_count,
      };

      const result = await createBooking(bookingData).unwrap();
      toast.success(result.message || 'Booking created successfully!');
      navigate(ROUTES.BOOKING_CONFIRMATION, {
        state: { booking: result.booking }
      });
    } catch (error: any) {
      handleError(error, 'Failed to create booking. Please try again.');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Card>
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-gray-900">
          {formatCurrency(property.rent_per_day)}
        </div>
        <div className="text-gray-600">per night</div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Check-in"
            type="date"
            min={today}
            {...register('check_in_date')}
            error={errors.check_in_date?.message}
          />
          <Input
            label="Check-out"
            type="date"
            min={checkInDate || today}
            {...register('check_out_date')}
            error={errors.check_out_date?.message}
          />
        </div>

        <Input
          label="Guests"
          type="number"
          min="1"
          max={maxGuests}
          {...register('guest_count', { valueAsNumber: true })}
          error={errors.guest_count?.message}
          helperText={`Maximum ${maxGuests} guests allowed`}
        />

        {/* Availability Status */}
        {nights > 0 && (
          <div className="flex items-center space-x-2">
            {isCheckingAvailability && (
              <>
                <Loading size="sm" />
                <span className="text-sm text-gray-600">Checking availability...</span>
              </>
            )}
            {availabilityChecked && isAvailable === true && (
              <div className="flex items-center space-x-2 text-green-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Available</span>
              </div>
            )}
            {availabilityChecked && isAvailable === false && (
              <div className="flex items-center space-x-2 text-red-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Not Available</span>
              </div>
            )}
          </div>
        )}

        {/* Conflicting Bookings Information */}
        {availabilityData && !isAvailable && availabilityData.conflicting_bookings?.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-red-800">Property not available</h4>
                <p className="text-sm text-red-700 mt-1">
                  There are {availabilityData.conflicting_bookings.length} conflicting booking(s) during your selected dates.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Property Details from Availability */}
        {availabilityData && isAvailable && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <div className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-green-800">
                  {availabilityData.property_details.title} is available!
                </h4>
                <p className="text-sm text-green-700 mt-1">
                  {availabilityData.property_details.property_type} in {availabilityData.property_details.city} •
                  {availabilityData.number_of_days} night{availabilityData.number_of_days > 1 ? 's' : ''} •
                  {availabilityData.guests} guest{availabilityData.guests > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        )}

        {nights > 0 && priceBreakdown && (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">
                  {formatCurrency(priceBreakdown.base_price_per_night)} × {priceBreakdown.total_nights} night{priceBreakdown.total_nights > 1 ? 's' : ''}
                </span>
                <span className="font-medium">
                  {formatCurrency(priceBreakdown.subtotal)}
                </span>
              </div>

              {priceBreakdown.cleaning_fee > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Cleaning fee</span>
                  <span className="font-medium">{formatCurrency(priceBreakdown.cleaning_fee)}</span>
                </div>
              )}

              {priceBreakdown.service_fee > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Service fee</span>
                  <span className="font-medium">{formatCurrency(priceBreakdown.service_fee)}</span>
                </div>
              )}

              {priceBreakdown.taxes > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Taxes</span>
                  <span className="font-medium">{formatCurrency(priceBreakdown.taxes)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center font-bold text-lg border-t border-gray-200 pt-2 mt-2">
              <span>Total</span>
              <span>{formatCurrency(priceBreakdown.total)}</span>
            </div>
          </div>
        )}

        {nights > 0 && !priceBreakdown && totalAmount > 0 && (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">
                {formatCurrency(property.rent_per_day)} × {nights} night{nights > 1 ? 's' : ''}
              </span>
              <span className="font-medium">
                {formatCurrency(totalAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center font-bold text-lg border-t border-gray-200 pt-2">
              <span>Total</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isLoading || isCheckingAvailability}
          disabled={
            isLoading ||
            nights === 0 ||
            isCheckingAvailability ||
            (availabilityChecked && isAvailable === false)
          }
        >
          {nights === 0
            ? 'Select dates'
            : isCheckingAvailability
            ? 'Checking availability...'
            : (availabilityChecked && isAvailable === false)
            ? 'Not available'
            : totalAmount > 0
            ? `Book for ${formatCurrency(totalAmount)}`
            : 'Book now'
          }
        </Button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-500">
        You won't be charged yet
      </div>
    </Card>
  );
};

export default BookingForm;
