import React from 'react';
import { useGetPropertyReviewsQuery } from '../../services/reviewApi';
import { StarRating, Card, Loading } from '../ui';
import ReviewCard from './ReviewCard';
import { cn } from '../../utils/helpers';

interface PropertyReviewsProps {
  propertyId: number;
  propertyTitle?: string;
  className?: string;
}

const PropertyReviews: React.FC<PropertyReviewsProps> = ({
  propertyId,
  className,
}) => {
  const {
    data: reviewsData,
    isLoading,
    error,
  } = useGetPropertyReviewsQuery(propertyId);

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <h3 className="text-xl font-semibold text-gray-900">Reviews</h3>
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('space-y-4', className)}>
        <h3 className="text-xl font-semibold text-gray-900">Reviews</h3>
        <Card padding="md">
          <p className="text-gray-600">Unable to load reviews at this time.</p>
        </Card>
      </div>
    );
  }

  const reviews = reviewsData?.reviews || [];
  const averageRating = reviewsData?.average_rating || 0;
  const totalReviews = reviewsData?.total || 0;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">
          Reviews {totalReviews > 0 && `(${totalReviews})`}
        </h3>
        {averageRating > 0 && (
          <div className="flex items-center space-x-2">
            <StarRating rating={averageRating} size="md" />
            <span className="text-sm text-gray-600">
              {averageRating.toFixed(1)} average
            </span>
          </div>
        )}
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Card padding="lg">
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.456L3 21l2.544-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
              />
            </svg>
            <h4 className="mt-4 text-lg font-medium text-gray-900">No reviews yet</h4>
            <p className="mt-2 text-gray-600">
              Be the first to share your experience with this property!
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.booking_id}
              review={review}
              showPropertyInfo={false}
            />
          ))}
        </div>
      )}

      {/* Load More Button (if needed for pagination) */}
      {reviews.length > 0 && reviews.length < totalReviews && (
        <div className="text-center">
          <button className="text-red-600 hover:text-red-700 font-medium">
            Load more reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyReviews;
