import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { RootState } from '../../store';
import { useGetUserReviewsQuery, useDeleteReviewMutation } from '../../services/reviewApi';
import { Review } from '../../types';
import { Layout } from '../../components/layout';
import { ReviewCard, ReviewModal } from '../../components/reviews';
import { Card, Loading, Button } from '../../components/ui';

const UserReviews: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const {
    data: reviewsData,
    isLoading,
    error,
    refetch,
  } = useGetUserReviewsQuery();

  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const reviews = reviewsData?.reviews || [];

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setShowEditModal(true);
  };

  const handleDeleteReview = async (review: Review) => {
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      try {
        await deleteReview(review.booking_id).unwrap();
        toast.success('Review deleted successfully');
        refetch();
      } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to delete review');
      }
    }
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    setEditingReview(null);
    refetch();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Loading />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card padding="lg">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Unable to load reviews
              </h2>
              <p className="text-gray-600 mb-4">
                There was an error loading your reviews. Please try again.
              </p>
              <Button onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reviews</h1>
          <p className="text-gray-600">
            Manage your property and host reviews
          </p>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <Card padding="lg">
            <div className="text-center py-12">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
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
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No reviews yet
              </h3>
              <p className="mt-2 text-gray-600">
                You haven't written any reviews yet. Complete a booking to leave your first review!
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <ReviewCard
                key={review.booking_id}
                review={review}
                showPropertyInfo={true}
                currentUserId={user?.id}
                onEdit={() => handleEditReview(review)}
                onDelete={() => handleDeleteReview(review)}
              />
            ))}
          </div>
        )}

        {/* Edit Review Modal */}
        {editingReview && (
          <ReviewModal
            isOpen={showEditModal}
            onClose={handleModalClose}
            bookingId={editingReview.booking_id}
            propertyId={editingReview.property_id}
            propertyTitle={editingReview.property_title || 'Property'}
            existingReview={editingReview}
          />
        )}
      </div>
    </Layout>
  );
};

export default UserReviews;
