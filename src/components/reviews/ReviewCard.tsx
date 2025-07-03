import React, { useState } from 'react';
import { Review } from '../../types';
import { StarRating, Card, Button } from '../ui';
import { cn } from '../../utils/helpers';

interface ReviewCardProps {
  review: Review;
  showPropertyInfo?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  currentUserId?: number;
  className?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  showPropertyInfo = false,
  onEdit,
  onDelete,
  currentUserId,
  className,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const isOwner = currentUserId === review.user_ID;
  const reviewerName = review.user_name || review.name || 'Anonymous';

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleEdit = () => {
    setShowDropdown(false);
    onEdit?.();
  };

  const handleDelete = () => {
    setShowDropdown(false);
    onDelete?.();
  };

  return (
    <Card className={cn('relative', className)} padding="md">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-semibold">
            {reviewerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-gray-900 mb-1">
              {reviewerName}
            </div>
            <div className="flex items-center space-x-2">
              <StarRating rating={review.property_rating} size="sm" />
              {review.created_at && (
                <span className="text-sm text-gray-500">
                  {formatDate(review.created_at)}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {isOwner && (onEdit || onDelete) && (
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDropdownToggle}
              className="p-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </Button>
            
            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {onEdit && (
                  <button
                    onClick={handleEdit}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Edit Review
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={handleDelete}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Delete Review
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Property Info */}
      {showPropertyInfo && review.property_title && (
        <div className="bg-gray-50 p-3 rounded-lg mb-4 flex items-center space-x-3">
          {review.property_image && (
            <img
              src={review.property_image}
              alt={review.property_title}
              className="w-12 h-12 rounded-lg object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          )}
          <div>
            <div className="font-semibold text-sm text-gray-900">
              {review.property_title}
            </div>
            {review.property_city && (
              <div className="text-xs text-gray-600">
                {review.property_city}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Text */}
      <div className="text-gray-700 leading-relaxed">
        {review.property_review}
      </div>

      {/* Host Review (if exists) */}
      {review.user_rating && review.user_review && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-gray-900">Host Review:</span>
            <StarRating rating={review.user_rating} size="sm" />
          </div>
          <div className="text-gray-700 text-sm">
            {review.user_review}
          </div>
        </div>
      )}
    </Card>
  );
};

export default ReviewCard;
