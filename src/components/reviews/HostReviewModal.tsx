import React from 'react';
import { Modal } from '../ui';
import HostReviewForm from './HostReviewForm';

interface HostReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number;
  guestName: string;
  propertyTitle: string;
}

const HostReviewModal: React.FC<HostReviewModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  guestName,
  propertyTitle,
}) => {
  const handleSuccess = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <HostReviewForm
        bookingId={bookingId}
        guestName={guestName}
        propertyTitle={propertyTitle}
        onSuccess={handleSuccess}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default HostReviewModal;
