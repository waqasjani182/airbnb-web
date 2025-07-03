import React from 'react';
import { cn } from '../../utils/helpers';
import StarRating from './StarRating';

interface RatingFilterProps {
  minRating?: number;
  maxRating?: number;
  onMinRatingChange: (rating: number | undefined) => void;
  onMaxRatingChange: (rating: number | undefined) => void;
  className?: string;
}

const RatingFilter: React.FC<RatingFilterProps> = ({
  minRating,
  maxRating,
  onMinRatingChange,
  onMaxRatingChange,
  className,
}) => {
  const ratingOptions = [
    { value: undefined, label: 'Any rating' },
    { value: 1, label: '1+ stars' },
    { value: 2, label: '2+ stars' },
    { value: 3, label: '3+ stars' },
    { value: 4, label: '4+ stars' },
    { value: 4.5, label: '4.5+ stars' },
  ];

  const handleQuickSelect = (rating: number) => {
    onMinRatingChange(rating);
    onMaxRatingChange(5); // Set max to 5 when using quick select
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating Filter
        </label>
        
        {/* Quick Rating Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {ratingOptions.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => {
                if (option.value === undefined) {
                  onMinRatingChange(undefined);
                  onMaxRatingChange(undefined);
                } else {
                  handleQuickSelect(option.value);
                }
              }}
              className={cn(
                'px-3 py-2 text-sm border rounded-md transition-colors',
                (option.value === undefined && !minRating) || 
                (option.value === minRating && maxRating === 5)
                  ? 'bg-primary-50 border-primary-200 text-primary-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              )}
            >
              {option.value !== undefined && (
                <div className="flex items-center justify-center space-x-1">
                  <StarRating rating={option.value} size="sm" />
                </div>
              )}
              <span className="block text-xs mt-1">{option.label}</span>
            </button>
          ))}
        </div>

        {/* Custom Range Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Min Rating
            </label>
            <select
              value={minRating || ''}
              onChange={(e) => onMinRatingChange(e.target.value ? Number(e.target.value) : undefined)}
              className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Any</option>
              <option value="1">1.0</option>
              <option value="1.5">1.5</option>
              <option value="2">2.0</option>
              <option value="2.5">2.5</option>
              <option value="3">3.0</option>
              <option value="3.5">3.5</option>
              <option value="4">4.0</option>
              <option value="4.5">4.5</option>
              <option value="5">5.0</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Max Rating
            </label>
            <select
              value={maxRating || ''}
              onChange={(e) => onMaxRatingChange(e.target.value ? Number(e.target.value) : undefined)}
              className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Any</option>
              <option value="1">1.0</option>
              <option value="1.5">1.5</option>
              <option value="2">2.0</option>
              <option value="2.5">2.5</option>
              <option value="3">3.0</option>
              <option value="3.5">3.5</option>
              <option value="4">4.0</option>
              <option value="4.5">4.5</option>
              <option value="5">5.0</option>
            </select>
          </div>
        </div>

        {/* Current Selection Display */}
        {(minRating || maxRating) && (
          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                Rating: {minRating || 0} - {maxRating || 5} stars
              </span>
              <button
                type="button"
                onClick={() => {
                  onMinRatingChange(undefined);
                  onMaxRatingChange(undefined);
                }}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingFilter;
