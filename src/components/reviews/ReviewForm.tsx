import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Review, CreateGuestReviewRequest, UpdateGuestReviewRequest } from '../../types';
import { StarRating, Card, Button, Input } from '../ui';
import { useCreateGuestReviewMutation, useUpdateGuestReviewMutation } from '../../services/reviewApi';

const reviewSchema = z.object({
  property_rating: z.number().min(1).max(5),
  property_review: z.string().min(10, 'Review must be at least 10 characters long'),
  user_rating: z.number().min(1).max(5).optional(),
  user_review: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  existingReview?: Review;
  bookingId: number;
  propertyId: number;
  propertyTitle: string;
  onSuccess?: (review: Review) => void;
  onCancel?: () => void;
  className?: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  existingReview,
  bookingId,
  propertyId,
  propertyTitle,
  onSuccess,
  onCancel,
  className,
}) => {
  const [propertyRating, setPropertyRating] = useState(existingReview?.property_rating || 5);
  const [hostRating, setHostRating] = useState(existingReview?.user_rating || 5);
  const [includeHostReview, setIncludeHostReview] = useState(!!existingReview?.user_review);

  const [createReview, { isLoading: isCreating }] = useCreateGuestReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateGuestReviewMutation();

  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      property_rating: existingReview?.property_rating || 5,
      property_review: existingReview?.property_review || '',
      user_rating: existingReview?.user_rating || 5,
      user_review: existingReview?.user_review || '',
    },
  });

  const propertyReviewText = watch('property_review');
  const hostReviewText = watch('user_review');

  useEffect(() => {
    setValue('property_rating', propertyRating);
  }, [propertyRating, setValue]);

  useEffect(() => {
    setValue('user_rating', hostRating);
  }, [hostRating, setValue]);

  const onSubmit = async (data: ReviewFormData) => {
    try {
      let result;

      if (existingReview) {
        // Update existing review
        const updateData: UpdateGuestReviewRequest = {
          property_rating: data.property_rating,
          property_review: data.property_review,
          ...(includeHostReview && {
            user_rating: data.user_rating,
            user_review: data.user_review,
          }),
        };

        result = await updateReview({
          bookingId,
          reviewData: updateData,
        }).unwrap();
      } else {
        // Create new review
        const createData: CreateGuestReviewRequest = {
          booking_id: bookingId,
          property_id: propertyId,
          property_rating: data.property_rating,
          property_review: data.property_review,
          ...(includeHostReview && {
            user_rating: data.user_rating,
            user_review: data.user_review,
          }),
        };

        result = await createReview(createData).unwrap();
      }

      toast.success(existingReview ? 'Review updated successfully!' : 'Review submitted successfully!');
      onSuccess?.(result.review);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <Card className={className} padding="lg">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {existingReview ? 'Edit Review' : 'Write a Review'}
      </h3>

      <div className="mb-4 text-sm text-gray-600">
        Property: <span className="font-medium">{propertyTitle}</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Property Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Rating
          </label>
          <StarRating
            rating={propertyRating}
            interactive={true}
            size="lg"
            onRatingChange={setPropertyRating}
          />
        </div>

        {/* Property Review */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            {...register('property_review')}
            placeholder="Share your experience with this property..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 resize-vertical"
          />
          {errors.property_review && (
            <p className="mt-1 text-sm text-red-600">{errors.property_review.message}</p>
          )}
          <div className="mt-1 text-xs text-gray-500">
            {propertyReviewText?.length || 0}/10 minimum characters
          </div>
        </div>

        {/* Host Review Toggle */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeHostReview}
              onChange={(e) => setIncludeHostReview(e.target.checked)}
              className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">Also review the host</span>
          </label>
        </div>

        {/* Host Review Section */}
        {includeHostReview && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Host Rating
              </label>
              <StarRating
                rating={hostRating}
                interactive={true}
                size="lg"
                onRatingChange={setHostRating}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Host Review
              </label>
              <textarea
                {...register('user_review')}
                placeholder="Share your experience with the host..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 resize-vertical"
              />
              {errors.user_review && (
                <p className="mt-1 text-sm text-red-600">{errors.user_review.message}</p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={!propertyReviewText || propertyReviewText.length < 10}
          >
            {existingReview ? 'Update Review' : 'Submit Review'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ReviewForm;
