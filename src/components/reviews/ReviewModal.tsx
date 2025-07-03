import React from 'react';
import { Review } from '../../types';
import { Modal } from '../ui';
import ReviewForm from './ReviewForm';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number;
  propertyId: number;
  propertyTitle: string;
  existingReview?: Review;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  propertyId,
  propertyTitle,
  existingReview,
}) => {
  const handleSuccess = (review: Review) => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ReviewForm
        existingReview={existingReview}
        bookingId={bookingId}
        propertyId={propertyId}
        propertyTitle={propertyTitle}
        onSuccess={handleSuccess}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default ReviewModal;
