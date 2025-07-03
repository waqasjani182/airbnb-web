import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { CreateHostReviewRequest } from '../../types';
import { StarRating, Card, Button } from '../ui';
import { useCreateHostReviewMutation } from '../../services/reviewApi';

const hostReviewSchema = z.object({
  owner_rating: z.number().min(1).max(5),
  owner_review: z.string().min(10, 'Review must be at least 10 characters long'),
});

type HostReviewFormData = z.infer<typeof hostReviewSchema>;

interface HostReviewFormProps {
  bookingId: number;
  guestName: string;
  propertyTitle: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

const HostReviewForm: React.FC<HostReviewFormProps> = ({
  bookingId,
  guestName,
  propertyTitle,
  onSuccess,
  onCancel,
  className,
}) => {
  const [guestRating, setGuestRating] = useState(5);

  const [createHostReview, { isLoading }] = useCreateHostReviewMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<HostReviewFormData>({
    resolver: zodResolver(hostReviewSchema),
    defaultValues: {
      owner_rating: 5,
      owner_review: '',
    },
  });

  const reviewText = watch('owner_review');

  const onSubmit = async (data: HostReviewFormData) => {
    try {
      const createData: CreateHostReviewRequest = {
        booking_id: bookingId,
        owner_rating: guestRating,
        owner_review: data.owner_review,
      };

      await createHostReview(createData).unwrap();
      toast.success('Guest review submitted successfully!');
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <Card className={className} padding="lg">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Review Your Guest
      </h3>

      <div className="mb-4 text-sm text-gray-600">
        <div>Guest: <span className="font-medium">{guestName}</span></div>
        <div>Property: <span className="font-medium">{propertyTitle}</span></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Guest Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Guest Rating
          </label>
          <StarRating
            rating={guestRating}
            interactive={true}
            size="lg"
            onRatingChange={setGuestRating}
          />
          <p className="mt-1 text-xs text-gray-500">
            Rate your guest's behavior, communication, and respect for your property
          </p>
        </div>

        {/* Guest Review */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            {...register('owner_review')}
            placeholder="Share your experience with this guest..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 resize-vertical"
          />
          {errors.owner_review && (
            <p className="mt-1 text-sm text-red-600">{errors.owner_review.message}</p>
          )}
          <div className="mt-1 text-xs text-gray-500">
            {reviewText?.length || 0}/10 minimum characters
          </div>
        </div>

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
            disabled={!reviewText || reviewText.length < 10}
          >
            Submit Review
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default HostReviewForm;
