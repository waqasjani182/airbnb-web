import { useState, useCallback } from 'react';
import { useGetPropertiesByCityQuery } from '../services/propertyApi';
import { useGetBookingsByDateRangeQuery } from '../services/bookingApi';
import type { PropertiesByCityResponse, PropertyWithRatings } from '../types/property.types';
import type { BookingsByDateRangeResponse, BookingWithRatings } from '../types/booking.types';

/**
 * Custom hook for searching properties by city with ratings
 */
export const usePropertiesByCity = (initialCity?: string) => {
  const [cityName, setCityName] = useState(initialCity || '');
  const [shouldFetch, setShouldFetch] = useState(false);

  const {
    data,
    error,
    isLoading,
    refetch,
  } = useGetPropertiesByCityQuery(cityName, {
    skip: !shouldFetch || !cityName.trim(),
  });

  const searchCity = useCallback((city: string) => {
    setCityName(city);
    setShouldFetch(true);
  }, []);

  const clearSearch = useCallback(() => {
    setCityName('');
    setShouldFetch(false);
  }, []);

  return {
    cityName,
    setCityName,
    searchCity,
    clearSearch,
    data,
    error,
    isLoading,
    refetch,
    hasSearched: shouldFetch,
  };
};

/**
 * Custom hook for getting bookings by date range with ratings
 */
export const useBookingsByDateRange = (initialFromDate?: string, initialToDate?: string) => {
  const [fromDate, setFromDate] = useState(initialFromDate || '');
  const [toDate, setToDate] = useState(initialToDate || '');
  const [shouldFetch, setShouldFetch] = useState(false);

  const {
    data,
    error,
    isLoading,
    refetch,
  } = useGetBookingsByDateRangeQuery(
    { from_date: fromDate, to_date: toDate },
    {
      skip: !shouldFetch || !fromDate || !toDate,
    }
  );

  const searchDateRange = useCallback((from: string, to: string) => {
    setFromDate(from);
    setToDate(to);
    setShouldFetch(true);
  }, []);

  const clearSearch = useCallback(() => {
    setFromDate('');
    setToDate('');
    setShouldFetch(false);
  }, []);

  const isValidDateRange = useCallback(() => {
    if (!fromDate || !toDate) return false;
    return new Date(fromDate) <= new Date(toDate);
  }, [fromDate, toDate]);

  return {
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    searchDateRange,
    clearSearch,
    data,
    error,
    isLoading,
    refetch,
    hasSearched: shouldFetch,
    isValidDateRange: isValidDateRange(),
  };
};

/**
 * Utility functions for working with the new endpoint data
 */
export const endpointUtils = {
  /**
   * Get top-rated properties from city search results
   */
  getTopRatedProperties: (data: PropertiesByCityResponse | undefined, limit = 5): PropertyWithRatings[] => {
    if (!data?.properties) return [];
    return data.properties
      .sort((a, b) => b.total_rating - a.total_rating)
      .slice(0, limit);
  },

  /**
   * Get properties by rating range
   */
  getPropertiesByRating: (
    data: PropertiesByCityResponse | undefined,
    minRating = 0,
    maxRating = 5
  ): PropertyWithRatings[] => {
    if (!data?.properties) return [];
    return data.properties.filter(
      (property) => property.total_rating >= minRating && property.total_rating <= maxRating
    );
  },

  /**
   * Get bookings with high ratings
   */
  getHighRatedBookings: (
    data: BookingsByDateRangeResponse | undefined,
    minRating = 4.0
  ): BookingWithRatings[] => {
    if (!data?.bookings) return [];
    return data.bookings.filter(
      (booking) =>
        (booking.property_rating && booking.property_rating >= minRating) ||
        (booking.user_rating && booking.user_rating >= minRating) ||
        (booking.owner_rating && booking.owner_rating >= minRating)
    );
  },

  /**
   * Get bookings by status
   */
  getBookingsByStatus: (
    data: BookingsByDateRangeResponse | undefined,
    status: string
  ): BookingWithRatings[] => {
    if (!data?.bookings) return [];
    return data.bookings.filter((booking) => booking.status.toLowerCase() === status.toLowerCase());
  },

  /**
   * Calculate average rating for a city
   */
  calculateCityAverageRating: (data: PropertiesByCityResponse | undefined): number => {
    if (!data?.properties || data.properties.length === 0) return 0;
    const totalRating = data.properties.reduce((sum, property) => sum + property.total_rating, 0);
    return totalRating / data.properties.length;
  },

  /**
   * Get revenue statistics from bookings data
   */
  getRevenueStats: (data: BookingsByDateRangeResponse | undefined) => {
    if (!data?.statistics) return null;

    const totalRevenue = parseFloat(data.statistics.total_revenue || '0');
    const totalBookings = data.statistics.total_bookings || 0;
    const bookingsWithRatings = data.statistics.bookings_with_ratings || 0;

    return {
      totalRevenue: isNaN(totalRevenue) ? 0 : totalRevenue,
      averageBookingValue: totalBookings > 0
        ? totalRevenue / totalBookings
        : 0,
      totalBookings,
      bookingsWithRatings,
      ratingPercentage: totalBookings > 0
        ? (bookingsWithRatings / totalBookings) * 100
        : 0,
    };
  },

  /**
   * Format currency for display
   */
  formatCurrency: (amount: number | string | undefined | null, currency = '₹'): string => {
    if (amount === undefined || amount === null) {
      return `${currency}0`;
    }

    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numAmount)) {
      return `${currency}0`;
    }

    return `${currency}${numAmount.toLocaleString('en-IN')}`;
  },

  /**
   * Format date for display
   */
  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },
};

export default {
  usePropertiesByCity,
  useBookingsByDateRange,
  endpointUtils,
};
